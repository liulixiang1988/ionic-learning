<%@ page language="java" import="java.util.*"
 contentType="application/uixml+xml; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/client/adapt.jsp"%>
<%
String strMsgType;
String classid;
String contentid;
classid=aa.getReqParameterValue("classid");
contentid=aa.getReqParameterValue("contentid");
strMsgType="2";
String wsurl=(String)session.getAttribute("wsurl");
String oaurl=wsurl.replaceAll("MobileOA.asmx", "");
%>
<aa:http id="newsdetail" keepreqdata="false" method="post" url="<%=wsurl%>">

<aa:header name="Content-Type" value="text/xml;charset=UTF-8"/>
<aa:header name="SOAPAction" value="\"http://www.tlys/GetNewsDetail\""/>
<aa:content>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tlys="http://www.tlys/">
   <soapenv:Header/>
   <soapenv:Body>
      <tlys:GetNewsDetail>         
         <tlys:strclassid><%=classid%></tlys:strclassid>
         <tlys:strcontentid><%=contentid%></tlys:strcontentid>
         <tlys:datatype><%=strMsgType%></tlys:datatype>
      </tlys:GetNewsDetail>
   </soapenv:Body>
</soapenv:Envelope>
</aa:content>
</aa:http>
<%
String strxml = aa.regex(".*","newsdetail").replaceAll("xmlns=\"http://www.tlys/\"", "");
//System.out.println(strxml);

%>
<aa:datasource id="newsdetailxml" wellformed="true" value="<%=strxml %>"></aa:datasource>
<%
strxml=aa.xpath("//GetNewsDetailResult","newsdetailxml");
//附件url构造
strxml=strxml.replace("=/portal/cms/uploadfile", "="+oaurl+"portal/cms/uploadfile");
strxml=strxml.replace("=&quot;/portal/cms/uploadfile", "=&quot;"+oaurl+"portal/cms/uploadfile");
//6.18日修改新闻类附件通过中转下载
//strxml=strxml.replace("/portal/cms/uploadfile/", "");
//strxml=strxml.replace("&quot;/portal/cms/uploadfile/", "");


strxml=strxml.replace("=/portal/cms/ewebeditor/sysimage/", "="+oaurl+"portal/cms/ewebeditor/sysimage/");
strxml=strxml.replace("=&quot;/portal/cms/ewebeditor/sysimage/", "=&quot;"+oaurl+"portal/cms/ewebeditor/sysimage/");

strxml=strxml.replace("width=10 height=10", "");
strxml=strxml.replace("&lt;", "<");
strxml=strxml.replace("&gt;", ">");
strxml=strxml.replace("\r\n", "<br/>");
strxml=strxml.replace("&#160;", " ");
strxml=strxml.replace("<p>", "<p class=bodysize>");
%>
<%=strxml%>
