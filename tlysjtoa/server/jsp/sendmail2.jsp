<%@ page language="java" import="java.util.*,com.fiberhome.bcs.appprocess.common.util.*"
 contentType="application/uixml+xml; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/client/adapt.jsp"%>

<%
String wsurl=(String)session.getAttribute("wsurl");
String receiveUserUid=aa.getReqParameterValue("uid");
String receiveUserName=aa.getReqParameterValue("to");
String MailSubject=aa.getReqParameterValue("subject");
String MailContent=aa.getReqParameterValue("content");
MailContent=MailContent.replaceAll("<br>","");
MailContent=MailContent.replaceAll("<BR>","");
String MailBox=aa.getReqParameterValue("mailbox");
String MailId=aa.getReqParameterValue("mailid");
String Istype=aa.getReqParameterValue("istype");

String fileName=aa.req.getAttachName("filename");
//String fileName=aa.getReqParameterValue("filename");
String fileType = fileName.substring(fileName.lastIndexOf(".")+1,fileName.length());
int gzlxSize=MailContent.length()+MailSubject.length();
int attCount=0;
int isAttach=0;
String Attcontent="";
if(fileName!="" && fileName!=null)
{
	//System.out.println("fileName"+fileName);
byte[] reqAttachBody = aa.req.getAttachBody("filename");//附件内容
sun.misc.BASE64Encoder encode =  new sun.misc.BASE64Encoder();
Attcontent = encode.encode(reqAttachBody);
int fileSize=reqAttachBody.length;//附件大小
//System.out.println("fileSize"+fileSize);
gzlxSize=gzlxSize+fileSize;
	if(fileSize>0)
	{
	attCount=1;
	isAttach=1;
	}
}

String strxml="<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
strxml= strxml+"<Workkeep>";
strxml=strxml+"<Body>";
strxml=strxml+"<Mailid>"+MailId+"</Mailid>";
strxml=strxml+"<MailBox>"+MailBox+"</MailBox>";
strxml=strxml+"<Istype>"+Istype+"</Istype>";
strxml=strxml+"<Shiyou>"+MailSubject+"</Shiyou>";
strxml=strxml+"<Receivers>"+receiveUserName+"</Receivers>";
strxml=strxml+"<Receiversuid>"+receiveUserUid+"</Receiversuid>";
strxml=strxml+"<Content>"+MailContent+"</Content>";
strxml=strxml+"<MailSize>"+gzlxSize+"</MailSize>";
strxml=strxml+"<AttachCount>"+attCount+"</AttachCount>";
strxml=strxml+"<IsAttach>"+isAttach+"</IsAttach>";
strxml=strxml+"<IsPriority>2</IsPriority>";
strxml=strxml+"<IsHtml>0</IsHtml>";
strxml=strxml+"<IsSaveSend>1</IsSaveSend>";
strxml=strxml+"<IsTimingSend>0</IsTimingSend>";
strxml=strxml+"<TimingSendTime>2007-9-1 08:00:00</TimingSendTime>";
strxml=strxml+"<ReturnReceipt>1</ReturnReceipt>";

if(fileName!="" && fileName!=null)
{
	
	if(isAttach>0)
	{
	strxml=strxml+"<Fujian>";
	strxml=strxml+"<Item Wjm=\""+fileName+"\" Wjlx=\""+fileType+"\" Fjmc=\""+fileName+"\">";
	 
	strxml=strxml+Attcontent;
	strxml=strxml+"</Item>";
	strxml=strxml+"</Fujian>";
	}
	
}
//strxml=strxml+"<tt>"+fileName+"</tt>";
strxml=strxml+"</Body>";
strxml=strxml+"</Workkeep>";
//System.out.println(strxml);
String strxml2="ok";
%>
<aa:http id="sendmail2" keepreqdata="false" method="post" url="<%=wsurl%>">

<aa:header name="Content-Type" value="text/xml;charset=UTF-8"/>
<aa:header name="SOAPAction" value="\"http://www.tlys/SendMail2\""/>

<aa:content>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tlys="http://www.tlys/">
   <soapenv:Header/>
   <soapenv:Body>
      <tlys:SendMail2>
         <tlys:attachXML><%=aa.common.escapeXML(strxml)%></tlys:attachXML>         
      </tlys:SendMail2>
   </soapenv:Body>
</soapenv:Envelope>
</aa:content>
</aa:http>
<%
 strxml = aa.regex(".*","sendmail2").replaceAll("xmlns=\"http://www.tlys/\"", "");
//System.out.println(strxml);
%>
<aa:datasource id="sendmail2xml" wellformed="true" value="<%=strxml %>"></aa:datasource>
<%=aa.xpath("//SendMail2Result","sendmail2xml") %>
<%=strxml2%>

